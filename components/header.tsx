"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AccountDropdown } from "@/components/dropdown-options";
import { AlignJustify, ShoppingCart, Heart, Slash, Check } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Header({ pathname }: any) {
  const baskets = useSelector((state: RootState) => state.basket);
  return (
    <header className="flex flex-col justify-between items-center h-[8.5rem] w-full">
      <div className="flex flex-row w-full">
        <div className="flex flex-1/3 w-full justify-between items-center">
          <div className="flex flex-row w-1/2 items-center">
            <Link href="/">
              <Image
                src="https://lalzmarjvjsqavjsuiux.supabase.co/storage/v1/object/public/IMAGES/Logo/a.jpg"
                alt="logo"
                width={150}
                height={75}
                className="rounded-md object-cover aspect-[150/75]"
                priority
              />
            </Link>
          </div>
        </div>
        <h1 className="text-xl font-bold ml-2 flex-1/3 flex w-full justify-center items-center">
          Choose the best perfume for you
        </h1>
        <div className="flex flex-1/3 w-full justify-center items-center" />
      </div>
      <div className="border border-y-foreground bg-primary flex flex-row justify-between items-center w-full h-14 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex flex-row items-center bg-primary rounded-lg">
              <AlignJustify />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <Link href="/">
                <DropdownMenuItem>Home</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Shop</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-row space-x-4">
          <Button className="flex flex-row items-center rounded-lg">
            <Heart />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  className="flex flex-row items-center rounded-lg"
                >
                  <ShoppingCart />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Card className={cn("w-[300px]")}>
                  <CardHeader>
                    <CardTitle>Your perfume basket</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {baskets.length > 0 ? (
                      <div>
                        {baskets.map((basket, index) => (
                          <div
                            key={index}
                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                          >
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {basket.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {basket.descriptions}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        You don't have any perfume in your basket
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {baskets.length > 0 && (
                      <Button className="w-full">
                        <Check /> Proceed to checkout
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AccountDropdown />
        </div>
      </div>
      {pathname === "/search/all" && (
        <div className="flex flex-row justify-between pb-3 mx-2">
          <Input
            name="search"
            type="search"
            placeholder="Search..."
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}

export default Header;
