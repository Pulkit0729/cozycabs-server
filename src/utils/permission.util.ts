import { rule } from 'graphql-shield';

export const isUserAuthenticated = rule()(async (
  _parent,
  _args,
  ctx,
  _info
) => {
  return ctx.user && ctx.user.phoneConfirmed;
});

export const isDriverAuthenticated = rule()(async (
  _parent,
  _args,
  ctx,
  _info
) => {
  return ctx.driver && ctx.driver.phoneConfirmed;
});
export const isAdmin = rule()(async (_parent, _args, ctx, _info) => {
  return ctx.isAdmin;
});
