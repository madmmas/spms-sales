
// view,create,edit,delete,draft,cancel,confirm,approve => coded as bits
// superadmin,admin,manager,sales => represent in array index
// format: "transactionType": [superadmin, admin, manager, sales]
const trx_perm = {
    "trxSales": [0x00, 0xff, 0x0f, 0x0f],
    "trxPurchase": [0xff, 0xff, 0x0f, 0x0f],
    "trxStockAdjustment": [0xff, 0xff, 0x0f, 0x0f],
    "trxStockDamage": [0xff, 0xff, 0x0f, 0x0f],
    "trxGeneralExpenses": [0xff, 0xff, 0x0f, 0x0f],
    "trxGeneralIncome": [0xff, 0xff, 0x0f, 0x0f],
    "trxLedgerAdjustment": [0xff, 0xff, 0x0f, 0x0f],
    "trxTransferCash": [0xff, 0xff, 0x0f, 0x0f],
    "trxTransferBank": [0xff, 0xff, 0x0f, 0x0f],
}

const getRole = () => {
    let role = localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).user.role
                : "";
    return role;
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

export const hasPermission = function(transactionType, action) {
    let roleName = getRole();
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

    console.log("RoleName:", roleName, "Permission:", permission, "Action:", action, "ActionBit:", actionBit);

    return (permission & actionBit) == actionBit;
}

