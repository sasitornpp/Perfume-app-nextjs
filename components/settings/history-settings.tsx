"use client";

// components/settings/HistorySettings.tsx
import React from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Clock, Eye, EyeOff } from "lucide-react";

// Dummy data
const recentActivities = [
	{ id: "1", action: "Added Chanel No.5 to wishlist", date: "2 hours ago" },
	{ id: "2", action: "Viewed Dior Sauvage", date: "3 hours ago" },
	{
		id: "3",
		action: "Added Tom Ford Tobacco Vanille to cart",
		date: "Yesterday",
	},
	{
		id: "4",
		action: "Removed Gucci Bloom from favorites",
		date: "2 days ago",
	},
	{ id: "5", action: "Updated profile information", date: "5 days ago" },
];

export function HistorySettings() {
	const [saveHistory, setSaveHistory] = React.useState(true);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Browsing History</CardTitle>
				<CardDescription>
					Manage your browsing history and activity tracking
					preferences.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-start space-x-4">
					<div className="space-y-0.5">
						<div className="flex items-center gap-2">
							<Switch
								id="save-history"
								checked={saveHistory}
								onCheckedChange={setSaveHistory}
							/>
							<Label
								htmlFor="save-history"
								className="text-sm font-medium"
							>
								Save browsing history
							</Label>
						</div>
						<p className="text-xs text-muted-foreground">
							When enabled, we'll save your browsing history to
							provide personalized recommendations.
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<h3 className="text-sm font-medium">Recent Activity</h3>
						<div className="flex gap-2">
							<Button size="sm" variant="outline">
								<EyeOff className="h-4 w-4 mr-2" />
								Hide
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Clear All
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						{recentActivities.map((activity, index) => (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.2,
									delay: index * 0.05,
								}}
							>
								<div className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors">
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-3 text-muted-foreground" />
										<span className="text-sm">
											{activity.action}
										</span>
									</div>
									<span className="text-xs text-muted-foreground">
										{activity.date}
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
