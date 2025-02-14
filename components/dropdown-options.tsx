"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOutAction } from "@/utils/supabase/api/auth";
import { UserRound, Settings, LogOut, Laptop, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

export function AccountDropdown() {
  const { user } = useSelector((state: RootState) => state.user);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleSetTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="flex flex-row items-center rounded-lg">
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Moon />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleSetTheme("light")}>
                  <Moon size={16} />{" "}
                  <span
                    className={`${
                      theme === "light" && "text-muted-foreground"
                    }`}
                  >
                    Light
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
                  <Sun size={16} />{" "}
                  <span
                    className={`${theme === "dark" && "text-muted-foreground"}`}
                  >
                    Dark
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetTheme("system")}>
                  <Laptop size={16} />{" "}
                  <span
                    className={`${
                      theme === "system" && "text-muted-foreground"
                    }`}
                  >
                    System
                  </span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          {user ? (
            <span onClick={async () => await signOutAction({ router })}>
              Sign out
            </span>
          ) : (
            <Link href="/sign-in">Sign in</Link>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

