/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Response } from "./api";

const SR_Fetcher = async <T>(url: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    cache: "no-cache",
  });
  return (await res.json()) as Response<T>;
};

export async function get<T>(url: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    cache: "no-cache",
  });
  return (await res.json()) as Response<T>;
}

export async function post<T>(url: string, body: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as Response<T>;
}

export async function put<T>(url: string, body: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as Response<T>;
}

export async function patch<T>(url: string, body: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as Response<T>;
}

export async function remove<T>(url: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
  });
  return (await res.json()) as Response<T>;
}

const SR_Api_MiniApp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_MINIAPP,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export { SR_Fetcher, SR_Api_MiniApp };
