const roles = {};
const actions = {};
const entities = {};

function createPromise(permitted) {
  return async req => {
    for (const name of permitted) {
      const role = roles[name];
      if (role) {
        const result = await role(req);
        if (result) {
          return true;
        }
      }
    }
    console.log(`[AUTH] Checking failed`, permitted);
    return false;
  };
}

const auth = {
  role(name, func) {
    roles[name] = func;
  },
  async can(req, permission) {
    const permitted = actions[permission];
    if (!permitted) {
      console.error(`[AUTH] Action not found: '${permission}'`);
      return false;
    }
    return permitted(req);
  },
  action(action, permitted) {
    actions[action] = createPromise(permitted);
  },
  entity(name, func) {
    entities[name] = func;
  },
  async get(req, name) {
    const entity = entities[name];
    if (!entity) {
      console.error(`[AUTH] Unable to retrieve entity '${name}'`);
      return null;
    }

    return entity(req);
  }
};
export default auth;
