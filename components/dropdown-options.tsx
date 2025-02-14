"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOutAction } from "@/utils/api/actions-client/auth";
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

  const handleSettheme = (theme: string) => {
    setTheme(theme);
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
            <span>ตั้งค่า</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Moon />
              <span>ธีม</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleSettheme("light")}>
                  <Moon size={16} />{" "}
                  <span
                    className={`${
                      theme === "light" && "text-muted-foreground"
                    }`}
                  >
                    สว่าง
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettheme("dark")}>
                  <Sun size={16} />{" "}
                  <span
                    className={`${theme === "dark" && "text-muted-foreground"}`}
                  >
                    มืด
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettheme("system")}>
                  <Laptop size={16} />{" "}
                  <span
                    className={`${
                      theme === "system" && "text-muted-foreground"
                    }`}
                  >
                    อุปกรณ์
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
              ออกจากระบบ
            </span>
          ) : (
            <Link href="/sign-in">เข้าสู่ระบบ</Link>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
