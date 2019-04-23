const React = require('react');

export function RoleSelector ({user, roles}) {
    return <div className="row">
        {roles.filter(r1=> {
            if(user.roles.filter(r2 => r2.id == r1.id).length > 0){
                return false;
            }
            else{
                return true;
            }
        }).map((r, index) => {
            return <div className="col-md-4" key={index}>
                <div className="card role_item">
                    <div className="card-block">
                        {r.name}
                    </div>
                </div>
            </div>;
        })}
    </div>;
}