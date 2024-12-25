/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { API_URL } from "@/const/api.const";
import { ICollection } from "@/interface/collection.interface";
import { IRole } from "@/interface/role.interface";
import { IRule } from "@/interface/rule.interface";
import {
  IInstruction,
  InstructionEnum,
} from "@/interface/rule_instruction.interface";
import { Response } from "@/util/api";
import { patch, post, remove } from "@/util/SR_api";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { cookies } from "next/headers";
import { RulePageState } from "./page";

const handleCreateSnapShot = async (projectId: string, ruleId: string) => {
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    API_URL.Bot.snapshot +
    `/${projectId}/${ruleId}`;

  await fetch(url, {
    method: "POST",
  });
};

export const createOrUpdateRule = async (
  rule: RulePageState,
  role: IRole,
  project_id: string
) => {
  if (rule.type === "create") {
    return await createRule(rule, role, project_id);
  } else {
    return await updateRule(rule, role, project_id);
  }
};

const createRule = async (
  rule: RulePageState,
  role: IRole,
  project_id: string
) => {
  try {
    const createInstructions = rule.ruleInstruction.map(async (instruction) => {
      const data = {
        type: instruction.type,
        quantity: instruction.quantity,
        collection_id: instruction.collection.id,
      };
      const res = await post<IInstruction>(
        API_URL.RuleInstruction.ruleInstruction,
        data
      );
      return res.metadata.id;
    });

    const instructions = await Promise.all(createInstructions);

    const data = {
      project_id,
      condition: rule.conditions,
      rule_instructions_ids: instructions,
      assignee_role_id: rule.assigneeRoleId,
      guild_name: role.name,
      guild_color: role.color.toString(),
      guild_icon: role.icon,
    };
    const res = await post<IRule>(API_URL.ProjectRule.projectRule, data);

    await handleCreateSnapShot(project_id, res.metadata.id);

    return res;
  } catch (error) {
    return {
      success: false,
      message: "Failed to create rule",
      error: error,
    };
  }
};

const updateRule = async (
  rule: RulePageState,
  role: IRole,
  project_id: string
) => {
  try {
    const createInstructions = rule.ruleInstruction.map(async (instruction) => {
      const data = {
        type: instruction.type,
        quantity: instruction.quantity,
        collection_id: instruction.collection.id,
      };
      const res = await post<IInstruction>(
        API_URL.RuleInstruction.ruleInstruction,
        data
      );
      return res.metadata.id;
    });

    const instructions = await Promise.all(createInstructions);

    // update rule instructions
    await patch<IInstruction>(API_URL.ProjectRule.updateInstruction, {
      rule_id: rule.id,
      instruction_ids: instructions,
    });

    const data = {
      condition: rule.conditions,
      assignee_role_id: rule.assigneeRoleId,
      guild_role_name: role.name,
      guild_role_color: role.color.toString(),
      guild_role_icon: role.icon,
    };

    const res = await patch<IRole>(
      API_URL.ProjectRule.projectRule + `/${rule.id}`,
      data
    );

    await handleCreateSnapShot(project_id, res.metadata.id);

    return res;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      error: error,
    };
  }
};

export const deleteRule = async (id: string) => {
  return await remove<IRule>(API_URL.ProjectRule.projectRule + `/${id}`);
};

export const CreateRoleAction = async (guild_id: string, role_name: string) => {
  return await post<IRole>(API_URL.Guild.createRole, {
    guild_id,
    role_name,
  });
};

export const CreateCollectionAction = async (
  project_id: string,
  type: InstructionEnum,
  name: string,
  icon: string,
  contract_address: string[],
  user_created?: string
) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + API_URL.Collection.collection,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
        body: JSON.stringify({
          project_id,
          type,
          name,
          icon,
          contract_address,
          is_common: false,
          user_created: user_created ? user_created : "ADMIN",
        }),
      }
    );

    return res.json() as Promise<Response<ICollection>>;
  } catch (error) {
    return {
      success: false,
      metadata: null,
      message: (error as Error).message,
    };
  }
};

export const handleSearchCollection = async (
  projectId: string,
  search: string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_URL.Collection.collectionSearch}${projectId}/${search}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    cache: "no-cache",
  });

  if (res.status !== 200) {
    return {
      success: false,
      metadata: [],
      message: "Failed to fetch collection",
    };
  }

  return res.json() as Promise<Response<ICollection[]>>;
};

export const includeCollection = async (body: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_URL.Collection.collection}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("token")?.value}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status !== 201) {
    return {
      success: false,
      metadata: null,
      message: "Failed to include collection",
    };
  } else {
    return res.json() as Promise<Response<ICollection>>;
  }
};

export const getTokenMetadata = async (address: string) => {
  try {
    const connection = new Connection(
      `https://rpc.shyft.to?api_key=${process.env.TOKEN_API_KEY}`
    );
    const metaplex = Metaplex.make(connection);
    const mintAddress = new PublicKey(address);

    const metadataAccount = await metaplex
      .nfts()
      .pdas()
      .metadata({ mint: mintAddress });
    const metadataAccountInfo =
      await connection.getAccountInfo(metadataAccount);

    if (metadataAccountInfo) {
      const token = await metaplex.nfts().findByMint({ mintAddress });
      const { name, symbol, json } = token;
      const img = json?.image || "";

      return { name, symbol, img, address: token.address.toString() };
    }
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null;
  }
};
