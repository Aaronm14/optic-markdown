<!-- metadata name="showConfirm" author="aidan" version="0.1.0" -->
## Confirm Alert
Sometimes it's useful to ask a user to confirm an action. To show an alert box with a message, a confirm an a cancel button you can use the following code. 

<!-- lens-def
schema="confirmAlert"
name="Show Confirm Alert"
"message".containing => message
"didConfirm"*
id="show-confirm"
"on yes" = ( any )
"on no" = ( any )

-->
```javascript
    showConfirm('message', (didConfirm)=> {
        if (didConfirm) {
            //:on yes
        } else {
            //:on no
        }
    })
```


#### Optic Schemas
##### Confirm Alert
<!-- schema-def
id="confirmAlert"
-->
```json
{
      "title": "confirm alert",
      "type": "object",
      "required": [
        "message"
      ],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
```