const React = require('react');

export function SelectedRoles ({user}) {
    return user.roles.map((r, index) => (
        <span key={index} style={{ margin: "0px 8px" }} >&#8226; {r.name}</span>
    ));
}