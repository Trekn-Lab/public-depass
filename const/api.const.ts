export const BASE_SOURCE =
  process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3005/api/v1";

export const API_URL = {
  Auth: {
    login: "/auth/discord/login",
    callback: "/auth/discord/callback",
    logout: "/auth/logout",
  },
  User: {
    me: "/user/me",
    allGuilds: "/user/me/all-guilds",
    guildsManager: "/user/me/guilds-manager",
    update: "/user/me/update",
    projects: "/user/me/projects",
    search: "/user/search",
  },
  Project: {
    project: "/project",
    projectCollection: "/project/collection/add",
    projectMembers: "/project/members/add",
    projectRule: "/project/rule/add",
    checkDuplicate: "/project/check/duplicate",
    projectMemberRemove: "/project/members/remove",
    projectRuleRemove: "/project/rule/remove",
  },
  Collection: {
    collection: "/collection",
    collectionProject: "/collection/project",
    collectionSearch: "/collection/project/",
  },
  ProjectRule: {
    projectRule: "/project-rule",
    project: "/project-rule/project",
    updateInstruction: "/project-rule/instruction/update",
    removeInstruction: "/project-rule/instruction/remove",
  },
  RuleInstruction: {
    ruleInstruction: "/rule-instruction",
  },
  Bot: {
    installBot: "/bot-command/install-bot",
    callback: "/bot-command/install-bot/callback",
    snapshot: "/bot-command/snapshot",
    checkPosition: "/bot-command/check-position",
  },
  Guild: {
    users: "/guild/users",
    roles: "/guild/roles",
    createRole: "/guild/roles/create",
    info: "/guild/info",
  },
  Utils: {
    time: "/utils/time",
    status: "/utils/status",
    upload: "/utils/upload",
  },
};

export const ROUTER = {
  ROOT: "/",
  AUTH: {
    LOGIN: "/login",
  },
};
