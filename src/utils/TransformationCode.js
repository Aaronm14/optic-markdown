import {parse} from 'acorn'
import {transform} from 'babel-core';

export function extractFunction(raw, name) {

	try {
		const ast = parse(raw, {ranges: true})

		const found = ast.body.find(child=> child.type === 'FunctionDeclaration' && child.id.name === name)

		const functionString = raw.substring(found.start, found.end)

		if (found) {
			return transform(functionString, {
				"presets": [require('babel-preset-es2015')],
				"plugins": [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-remove-strict-mode')]
			}).code
		}

	} catch (errors) {
		// console.log(errors)
	}

}