module.exports = {
    user: [
        {
            id: 1,
            name: "Administrator",
            username: "admin",
            email: "admin@example.com",
            password: "",
            confirmation: "",
            is_confirmed: true,
            is_active: true,
            is_super_admin: true,
            utc_created: "",
            utc_updated: ""
        },
        {
            id: 2,
            name: "Georgiana Harmon",
            username: "gharmon",
            email: "gharmon@example.com",
            password: "",
            confirmation: "",
            is_confirmed: true,
            is_active: true,
            is_super_admin: false,
            utc_created: "",
            utc_updated: ""
        },
        {
            id: 3,
            name: "Onur Bird",
            username: "obird",
            email: "obird@example.com",
            password: "",
            confirmation: "",
            is_confirmed: true,
            is_active: true,
            is_super_admin: false,
            utc_created: "",
            utc_updated: ""
        },
        {
            id: 4,
            name: "Leanne Graham",
            username: "lgraham",
            email: "lgraham@example.com",
            password: "",
            confirmation: "",
            is_confirmed: true,
            is_active: false,
            is_super_admin: false,
            utc_created: "",
            utc_updated: ""
        },
        {
            id: 5,
            name: "Ervin Howell",
            username: "ehowell",
            email: "ehowell@example.com",
            password: "",
            confirmation: "",
            is_confirmed: false,
            is_active: false,
            is_super_admin: false,
            utc_created: "",
            utc_updated: ""
        }
    ],
    role: [
        { id: "1", name: "Content Creator", accesses: [
            { module: "blog", access: "can_add" },
            { module: "blog", access: "can_edit" },
            { module: "blog", access: "can_delete" },
        ] },
        { id: "2", name: "Content Reviewer", accesses: [
            { module: "blog", access: "can_add" },
            { module: "blog", access: "can_edit" },
            { module: "blog", access: "can_delete" },
            { module: "blog", access: "can_publish" },
        ] },
        { id: "3", name: "Maintainer", accesses: [
            { module: "page", access: "can_add" },
            { module: "page", access: "can_edit" },
            { module: "page", access: "can_delete" },
            { module: "page", access: "can_publish" },
        ] },
        { id: "4", name: "Reporter", accesses: [
            { module: "bug", access: "can_add" },
            { module: "bug", access: "can_edit" },
            { module: "bug", access: "can_delete" },
            { module: "bug", access: "can_publish" },
        ] }
    ]
}