"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Globe,
  DollarSign,
  Mail,
  Bell,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedSettings, setEditedSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminAPI.getSettings();
        setSettings(res.data.data);
        const initial: Record<string, any> = {};
        res.data.data.forEach((s: any) => {
          initial[s.key] = s.value;
        });
        setEditedSettings(initial);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const setting = settings.find((s) => s.key === key);
      if (setting) {
        await adminAPI.updateSetting(setting._id, {
          value: editedSettings[key],
        });
      } else {
        await adminAPI.createSetting({ key, value: editedSettings[key] });
      }
      toast.success(`Setting "${key}" updated`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const s of settings) {
        if (editedSettings[s.key] !== s.value) {
          await adminAPI.updateSetting(s._id, { value: editedSettings[s.key] });
        }
      }
      toast.success("All settings saved");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy" />
      </div>
    );

  const settingGroups = [
    {
      title: "General Settings",
      icon: Globe,
      keys: ["siteName", "siteDescription", "contactEmail", "contactPhone"],
      defaults: {
        siteName: "Augeo Auctions",
        siteDescription: "Premium auction platform",
        contactEmail: "support@augeo.com",
        contactPhone: "+1-800-AUGEO",
      },
    },
    {
      title: "Financial Settings",
      icon: DollarSign,
      keys: [
        "defaultBuyersPremium",
        "defaultCommissionRate",
        "taxRate",
        "currency",
      ],
      defaults: {
        defaultBuyersPremium: "15",
        defaultCommissionRate: "10",
        taxRate: "8",
        currency: "USD",
      },
    },
    {
      title: "Auction Settings",
      icon: Settings,
      keys: [
        "minBidIncrement",
        "autoBidEnabled",
        "auctionExtensionMinutes",
        "maxImagesPerLot",
      ],
      defaults: {
        minBidIncrement: "10",
        autoBidEnabled: "true",
        auctionExtensionMinutes: "5",
        maxImagesPerLot: "10",
      },
    },
    {
      title: "Security & Verification",
      icon: Shield,
      keys: [
        "requireKYC",
        "requireEmailVerification",
        "maxLoginAttempts",
        "sessionTimeout",
      ],
      defaults: {
        requireKYC: "true",
        requireEmailVerification: "true",
        maxLoginAttempts: "5",
        sessionTimeout: "24",
      },
    },
    {
      title: "Email & Notifications",
      icon: Mail,
      keys: [
        "smtpHost",
        "smtpPort",
        "smtpUser",
        "enableEmailNotifications",
        "enableSmsNotifications",
      ],
      defaults: {
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        enableEmailNotifications: "true",
        enableSmsNotifications: "false",
      },
    },
  ];

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-dark flex items-center gap-2">
          <Settings className="h-6 w-6 text-burgundy" /> System Settings
        </h1>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary !py-2 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Changes
        </button>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="card p-6">
          <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2">
            <group.icon className="h-5 w-5 text-burgundy" /> {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.keys.map((key) => {
              const value =
                editedSettings[key] ??
                group.defaults[key as keyof typeof group.defaults] ??
                "";
              const isBool =
                value === "true" ||
                value === "false" ||
                typeof value === "boolean";

              return (
                <div key={key}>
                  <label className="text-base font-medium text-gray-700 mb-1 block">
                    {formatLabel(key)}
                  </label>
                  {isBool ? (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setEditedSettings({
                              ...editedSettings,
                              [key]:
                                editedSettings[key] === "true" ||
                                editedSettings[key] === true
                                  ? "false"
                                  : "true",
                            })
                          }
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-burgundy/20 ${
                            value === "true" || value === true
                              ? "bg-burgundy"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value === "true" || value === true
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-base font-medium text-gray-600 min-w-[60px]">
                          {value === "true" || value === true
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setEditedSettings({
                          ...editedSettings,
                          [key]: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder={
                        group.defaults[key as keyof typeof group.defaults]
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="card p-6">
        <h3 className="font-heading font-semibold text-dark mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-burgundy" /> All Stored Settings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">
                  Key
                </th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">
                  Value
                </th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Array.isArray(settings) &&
                settings.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{s.key}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editedSettings[s.key] ?? s.value}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            [s.key]: e.target.value,
                          })
                        }
                        className="input-field !py-1 text-base"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleSave(s.key)}
                        className="text-sm text-burgundy hover:underline"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {settings.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              No settings found. Settings will be created when you save.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
