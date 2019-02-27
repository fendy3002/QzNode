import * as mocha from 'mocha';
import * as render from '../../src/lib/render';
const { use, expect } = require('chai');
const chaiHtml  = require('chai-html');

const assert = require('assert');
mocha.describe('Lib/Render', function() {
    mocha.it('should render elements', function(done) {
        use(chaiHtml);
        const content = render.render([
            {
                elemType: "twoCol",
                first: {
                    elemType: "input",
                    name: "name",
                    value: "Luke Skywalker"
                },
                second: {
                    elemType: "checkbox",
                    name: "active",
                    label: "Active",
                    checked: false,
                    value: "true"
                }
            },
            {
                elemType: "twoCol",
                first: {
                    elemType: "select",
                    name: "nationality",
                    value: "",
                    empty: "-- SELECT ONE --",
                    options: [
                        { label: "Tatooine", value: "tatooine" },
                        { label: "Alderaan", value: "alderaan" }
                    ]
                },
                second: {
                    elemType: "textarea",
                    name: "description",
                    options: {
                        rows: 5,
                    },
                    value: "My name is what?"
                }
            },
            {
                elemType: "custom",
                content: () => {
                    return `<div class="row">
                        My father name is: {{ name }}
                    </div>`;
                },
                data: {
                    name: "Anakin Skywalker"
                }
            }
        ]);
        const exptected = `<div class="row">
                <div class="col-sm-6">
                    <input type="text" class="form-control underlined" value="Luke Skywalker" name="name" />
                </div>
                <div class="col-sm-6">
                    <label class="">
                        <input type="checkbox" class="checkbox" value="true" name="active" />
                        <span>Active</span>
                    </label>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <select type="text" class="form-control underlined" name="nationality">
                        <option value="" selected>-- SELECT ONE --</option>
                        <option value="tatooine">Tatooine</option>
                        <option value="alderaan">Alderaan</option>
                    </select></div>
                <div class="col-sm-6">
                    <textarea class="form-control underlined" rows="5" name="description">My name is what?</textarea>
                </div>
            </div>
            <div class="row">
                My father name is: Anakin Skywalker
            </div>`;
        
        expect(content).html.to.equal(exptected);
        done();
    });
});