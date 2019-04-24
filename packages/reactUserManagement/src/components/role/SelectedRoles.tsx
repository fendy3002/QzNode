const React = require('react');
const lo = require('lodash');

export function SelectedRoles ({user, selectedRoles, onClick}) {
    return lo.sortBy(selectedRoles, r => r.id).map((r, index) => (
        <a data-id={r.id} onClick={onClick} key={index} href="javascript:void(0)">
            <span style={{ margin: "0px 8px" }} >&#8226; {r.name}</span>
        </a>
    ));
}