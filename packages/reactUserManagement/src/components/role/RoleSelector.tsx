const React = require('react');

export function RoleSelector ({user, selectedRoles, roles, onClick}) {
    return <div className="row">
        {roles.filter(r1=> {
            if(selectedRoles.filter(r2 => r2.id == r1.id).length > 0){
                return false;
            }
            else{
                return true;
            }
        }).map((r, index) => {
            return <div className="col-md-4" key={index}>
                <a onClick={onClick} data-id={r.id}>
                    <div className="card role_item">
                        <div className="card-block">
                            {r.name}
                        </div>
                    </div>
                </a>
            </div>;
        })}
    </div>;
}