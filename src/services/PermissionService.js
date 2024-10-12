
// view,create,edit,delete,draft,cancel,confirm,approve => coded as bits
// superadmin,admin,manager,sales => represent in array index
// format: "transactionType": [superadmin, admin, manager, sales]
const trx_perm = {
    "sales": [0xff, 0xff, 0x0f, 0x0f],
    "purchase": [0xff, 0xff, 0x0f, 0x0f],
    "stock": [0xff, 0xff, 0x0f, 0x0f],
    "account": [0xff, 0xff, 0x0f, 0x0f],
    "transfer_money": [0xff, 0xff, 0x0f, 0x0f],
    "payments": [0xff, 0xff, 0x0f, 0x0f],
}

const getPermission = function(transactionType, roleName) {

    let roleIndex = 0;
    switch (roleName) {
        case "admin":
            roleIndex = 1;
            break;
        case "manager":
            roleIndex = 2;
            break;
        case "sales":
            roleIndex = 3;
            break;
        default:
            roleIndex = 0;
            break;
    }

    let permission = trx_perm[transactionType][roleIndex];
    return permission;
    
}

const hasPermission = function(transactionType, roleName, action) {
    let permission = getPermission(transactionType, roleName);
    let actionBit = 0;
    switch (action) {
        case "view":
            actionBit = 0x01;
            break;
        case "create":
            actionBit = 0x02;
            break;
        case "edit":
            actionBit = 0x04;
            break;
        case "delete":
            actionBit = 0x08;
            break;
        case "draft":
            actionBit = 0x10;
            break;
        case "cancel":
            actionBit = 0x20;
            break;
        case "confirm":
            actionBit = 0x40;
            break;
        case "approve":
            actionBit = 0x80;
            break;
        default:
            actionBit = 0;
    }

    return (permission & actionBit) == actionBit;
}

export default {
    getPermission,
    hasPermission,
}