import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import * as jsonValidator from '../../../src/validator/json';

mocha.describe("validator dynamic object", function (this) {
  let schema = {
    type: "object",
    properties: {
      "StatusCode": {
        type: "string",
        required: true,
        enum: [
          "00",
          "10"
        ]
      },
      "Summary": {
        type: "string",
        required: true,
        maxLength: 100
      },
      "Description": {
        type: "string",
        required: false
      },
      "DescriptionFormat": {
        type: "string",
        required: false,
        enum: ["00", "01"]
      },
      "Approvers": {
        type: "array",
        items: {
          minItems: 1,
          maxItems: 10,
          type: "object",
          properties: {
            "ApproverUserAccountKey": {
              type: "string"
            }
          }
        }
      },
      "ApplicationCode": {
        type: "string",
        required: true
      },
      "ModuleCode": {
        type: "string",
        required: true
      },
      "DataJSON": {
        type: "object",
        required: true,
        additionalProperties: {
          anyOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            {
              type: "object",
              properties: {
                header: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: { type: "string" },
                      value: { type: "string" },
                    }
                  }
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: {
                      type: "any"
                    }
                  }
                }
              }
            }
          ]
        }
      },
      "Key": {
        type: "string",
        required: true
      },
      "CallbackLinkCode": {
        type: "string",
        required: true
      },
      "CallbackParam": {
        type: "object",
        required: false
      }
    }
  };
  mocha.it("validate json schema", async function () {
    let result = await jsonValidator.schema(schema).validate<any>({
      Summary: 'Pengajuan Perubahan Project X',
      StatusCode: '10',
      Description: null,
      DescriptionFormat: null,
      Approvers: [
        { ApproverUserAccountKey: '0a8cd58a-d173-4350-947f-3ee2607dbb9e' }
      ],
      ApplicationCode: 'project-management',
      ModuleCode: 'project',
      Key: 'c9051329-b275-4915-96f1-b9d8a6adfdef',
      DataJSON: {
        Facility: 'Indadi Setia',
        'Project Name': 'PROJECT2',
        'Start Date': '2020-02-11',
        'Project Value': 10000000
      },
      CallbackLinkCode: 'project-approval',
      CallbackParam: { project_id: 'c9051329-b275-4915-96f1-b9d8a6adfdef' }
    });

    addContext(this, {
      title: "result",
      value: result
    });
    assert.equal(true, result.isValid);
    assert.equal("c9051329-b275-4915-96f1-b9d8a6adfdef", result.data.Key);
  });
});