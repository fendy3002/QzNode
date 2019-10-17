import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import healthcheck from '../../src/healthcheck/index';
import * as i from '../../src/index';

let generateApp = () => {
  let express = require('express');
  return express();
}

mocha.describe("healthcheck", function(this) {
  mocha.it("/~/health should return http status code 204", async function(){
    let app = generateApp();
    app.use(await healthcheck({}));

    let response = await chai.request(app)
      .get('/~/health');
    
    assert.equal(204, response.status);
  });
  mocha.it("/~/liveness should check configured", async function(){
    let app = generateApp();
    let check = {
      mysql: async () => {
        return;
      },
      mongo: async () => {
        throw new Error("Mongo not connected");
      }
    };
    app.use(await healthcheck({
      check
    }));

    let response = await chai.request(app)
      .get('/~/readiness');

    addContext(this, {
      title: "res.body",
      value: response.body
    });
    assert.equal("ok", response.body.mysql.status);
    assert.equal("failed", response.body.mongo.status);
    assert.equal("Mongo not connected", response.body.mongo.err);
  });
  mocha.it("/~/liveness should timeout", async function(){
    let app = generateApp();
    let check = {
      mysql: async () => {
        return;
      },
      mongo: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }
    };
    app.use(await healthcheck({
      check,
      checkTimeout: 400
    }));

    let response = await chai.request(app)
      .get('/~/readiness');

    addContext(this, {
      title: "res.body",
      value: response.body
    });
    assert.equal("ok", response.body.mysql.status);
    assert.equal("failed", response.body.mongo.status);
    assert.equal("Timeout", response.body.mongo.err);
  });
});