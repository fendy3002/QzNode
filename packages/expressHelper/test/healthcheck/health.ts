import * as mocha from 'mocha';
// assert cannot be defaulted import
import assert = require('assert');
import addContext = require('mochawesome/addContext');
import express = require('express');
import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import healthcheck from '../../src/healthcheck/index';

mocha.describe("healthcheck", function(this) {
  mocha.it("/~/health should return http status code 204", async function(){
    let app = express();
    app.use(await healthcheck({}));

    let response = await chai.request(app)
      .get('/~/health');
    
    assert.equal(204, response.status);
  });
  mocha.it("/~/liveness should check configured", async function(){
    let app = express();
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
    
    assert.equal("ok", response.body.mysql.status);
    assert.equal("failed", response.body.mongo.status);
    assert.equal("Mongo not connected", response.body.mongo.err);
  });

})