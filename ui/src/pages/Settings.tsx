import SettingsForm from "@/components/SettingsForm";

const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">
          Configure monitoring parameters, alerts, and system behavior
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
};

export default Settings;