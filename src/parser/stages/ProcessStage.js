import {Annotation} from "../Annotation";
import {Schema} from "../../sdk-objects/Schema";
import {Dependencies} from "../../sdk-objects/Dependencies";
import {Description} from "../../sdk-objects/Description";
import {Finder} from "../../sdk-objects/lenses/Finder";
import {Component} from "../../sdk-objects/lenses/Component";
import {Lens} from "../../sdk-objects/lenses/Lens";

export function processAnnotations(rawAnnotations, callback) {

	const sdkAnnotations = rawAnnotations.filter(i=> i.type === 'annotationPair' || i.type === 'annotation').map(i=> new Annotation(i.type, i.properties, i.codeBlock))

	const dependenciesAnnotation = (()=> {
		const allDependencyLists = rawAnnotations.filter(i=> i.type === 'dependenciesAnnotation').map(i=> i.dependencies)
		const mergedDependencies = [].concat.apply([], allDependencyLists);

		return new Dependencies(mergedDependencies)
	})()

	const validAnnotations = sdkAnnotations.filter(i=> i.isValid())

	const asSDKObjects = validAnnotations.map(annotationToSdkObject)

	const validSDKObjects = asSDKObjects.filter(i=> i.isValid())

	const errors = sdkAnnotations.filter(i=> !i.isValid()).map(i=> i.errors())
		     .concat(asSDKObjects.filter(i=> !i.isValid()).map(i=> i.errors()))

	const description = new Description(null, dependenciesAnnotation,
		validSDKObjects.filter(i=> i instanceof Schema),
		validSDKObjects.filter(i=> i instanceof Lens),
	)

	callback(description, errors.length ? null : errors)

}

export function annotationToSdkObject(annotation) {

	//@todo clean up error flow
	switch (annotation.definitionType) {
		case 'schema-def':

			const id = annotation.getProperty('id')
			let json;

			try {
				json = JSON.parse(annotation.codeBlock)
			} catch(e) {

			}

			return new Schema(id, json)

		case 'lens-def':
			const name = annotation.getProperty('name')
			const schema = annotation.getProperty('schema')

			const codeComponents = annotation.getPropertiesOfType('finderProperty').map(f=> {
				const finder = new Finder(f)
				return new Component('code', finder, f.propertyPath)
			})

			return new Lens(name, schema, annotation.codeBlock, annotation.scope, codeComponents, [])
	}

}