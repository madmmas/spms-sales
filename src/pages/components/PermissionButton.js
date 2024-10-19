import { hasPermission } from "../../services/PermissionService";

const PermissionButton = ({ transactionType, action, children }) => {
    return hasPermission(transactionType, action) ? children : null;
}
export default PermissionButton;

