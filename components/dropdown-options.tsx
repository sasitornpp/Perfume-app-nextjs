"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
	UserRound,
	User,
	LogOut,
	Laptop,
	Moon,
	Sun,
	LogIn,
	Bell,
	CreditCard,
	ShieldCheck,
	Heart,
	HelpCircle,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/user/userReducer";
import { AppDispatch } from "@/redux/Store";

export function AccountDropdown() {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.user.profile);
	const user = useSelector((state: RootState) => state.user.user);
	const isLoggedIn = !!user;
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const [dropdownOpen, setDropdownOpen] = React.useState(false);

	const handleSetTheme = (selectedTheme: string) => {
		setTheme(selectedTheme);
		setDropdownOpen(false);
	};

	const handleLogout = async () => {
		await dispatch(logoutUser());
		setDropdownOpen(false);
		router.push("/sign-in");
	};

	const navigateTo = (path: string) => {
		router.push(path);
		setDropdownOpen(false);
	};

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full h-10 w-10 p-0 relative"
				>
					<Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-all duration-200">
						{isLoggedIn ? (
							<>
								<AvatarImage
									src={profile?.images || ""}
									alt="Profile"
								/>
								<AvatarFallback className="bg-primary/10 text-primary">
									{profile?.name?.charAt(0) ||
										user?.email?.charAt(0) ||
										"U"}
								</AvatarFallback>
							</>
						) : (
							<AvatarFallback className="bg-muted">
								<UserRound className="h-5 w-5 text-muted-foreground" />
							</AvatarFallback>
						)}
					</Avatar>
					{isLoggedIn && (
						<Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary">
							<span className="sr-only">Notifications</span>
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
				{isLoggedIn ? (
					<>
						<div className="flex items-center gap-3 p-2">
							<Avatar className="h-10 w-10 border border-primary/20">
								<AvatarImage
									src={profile?.images || ""}
									alt="Profile"
								/>
								<AvatarFallback className="bg-primary/10 text-primary">
									{profile?.name?.charAt(0) ||
										user?.email?.charAt(0) ||
										"U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col space-y-0.5">
								<p className="font-medium text-sm">
									{profile?.name || user?.email || "User"}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{user?.email || ""}
								</p>
							</div>
						</div>
						<DropdownMenuSeparator />
					</>
				) : (
					<DropdownMenuLabel className="font-normal text-muted-foreground">
						Sign in to access your account
					</DropdownMenuLabel>
				)}

				<DropdownMenuGroup className="space-y-1">
					{isLoggedIn && (
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => navigateTo("/profile")}
						>
							<User className="mr-2 h-4 w-4" />
							<span>Account</span>
						</DropdownMenuItem>
					)}

					{isLoggedIn && (
						<>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => navigateTo("/#")}
							>
								<Bell className="mr-2 h-4 w-4" />
								<span>Notifications</span>
								<Badge className="ml-auto h-5 px-1.5 bg-primary text-xs">
									3
								</Badge>
							</DropdownMenuItem>

							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => navigateTo("/#")}
							>
								<CreditCard className="mr-2 h-4 w-4" />
								<span>Billing</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => navigateTo("/#")}
							>
								<ShieldCheck className="mr-2 h-4 w-4" />
								<span>Security</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => navigateTo("/#")}
							>
								<Heart className="mr-2 h-4 w-4" />
								<span>Favorites</span>
							</DropdownMenuItem>
						</>
					)}

					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="cursor-pointer">
							{theme === "dark" ? (
								<Moon className="mr-2 h-4 w-4" />
							) : theme === "light" ? (
								<Sun className="mr-2 h-4 w-4" />
							) : (
								<Laptop className="mr-2 h-4 w-4" />
							)}
							<span>Theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-32 p-1">
								<DropdownMenuItem
									className="cursor-pointer flex items-center gap-2"
									onClick={() => handleSetTheme("light")}
								>
									<Sun size={16} />
									<span
										className={
											theme === "light"
												? "text-primary font-medium"
												: ""
										}
									>
										Light
									</span>
									{theme === "light" && (
										<Badge
											variant="outline"
											className="ml-auto h-5 px-1.5 border-primary text-primary text-xs"
										>
											Active
										</Badge>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer flex items-center gap-2"
									onClick={() => handleSetTheme("dark")}
								>
									<Moon size={16} />
									<span
										className={
											theme === "dark"
												? "text-primary font-medium"
												: ""
										}
									>
										Dark
									</span>
									{theme === "dark" && (
										<Badge
											variant="outline"
											className="ml-auto h-5 px-1.5 border-primary text-primary text-xs"
										>
											Active
										</Badge>
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer flex items-center gap-2"
									onClick={() => handleSetTheme("system")}
								>
									<Laptop size={16} />
									<span
										className={
											theme === "system"
												? "text-primary font-medium"
												: ""
										}
									>
										System
									</span>
									{theme === "system" && (
										<Badge
											variant="outline"
											className="ml-auto h-5 px-1.5 border-primary text-primary text-xs"
										>
											Active
										</Badge>
									)}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => navigateTo("/help")}
					>
						<HelpCircle className="mr-2 h-4 w-4" />
						<span>Help & Support</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="cursor-pointer">
					{isLoggedIn ? (
						<div
							className="flex items-center w-full"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4 text-destructive" />
							<span className="text-destructive">Sign out</span>
						</div>
					) : (
						<div
							className="flex items-center w-full"
							onClick={() => navigateTo("/sign-in")}
						>
							<LogIn className="mr-2 h-4 w-4 text-primary" />
							<span className="text-primary font-medium">
								Sign in
							</span>
						</div>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
