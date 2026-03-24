import { useToast } from "primevue/usetoast";

export function useAppToast() {
  const toast = useToast();

  const showToast = (action, customMessage = null) => {
    switch (action) {
      case "create":
        toast.add({
          severity: "success",
          summary: "Success",
          detail: customMessage || "Created successfully",
          life: 3000,
        });
        break;
      case "update":
        // PrimeVue doesn't have a "primary" severity, so "info" is used as the standard fallback for updates.
        toast.add({
          severity: "info",
          summary: "Updated",
          detail: customMessage || "Updated successfully",
          life: 3000,
        });
        break;
      case "delete":
        toast.add({
          severity: "info",
          summary: "Deleted",
          detail: customMessage || "Deleted successfully",
          life: 3000,
        });
        break;
      case "error":
        toast.add({
          severity: "error",
          summary: "Error",
          detail:
            customMessage || "Cannot delete or delete associated field first",
          life: 5000,
        });
        break;
      default:
        break;
    }
  };

  return { showToast };
}
