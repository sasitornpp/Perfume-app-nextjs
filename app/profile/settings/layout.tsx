import { SettingsLayout } from "@/components/settings/settings-layout";

export default function SettingsPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <SettingsLayout>{children}</SettingsLayout>;
}
