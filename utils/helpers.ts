export function getUserDisplayName({
  username,
  firstName,
  lastName,
}: {
  username: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}) {
  if (firstName) return `${firstName}${lastName ? ` ${lastName}` : ""}`;
  return username ?? "error";
}
