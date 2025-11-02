
import { getSettings } from '@/lib/actions/setting.actions';
import SettingsForm from '@/components/admin/settings/settings-form';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store settings and preferences.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
