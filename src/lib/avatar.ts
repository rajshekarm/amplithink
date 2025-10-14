// utils/generateAvatarUri.ts
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
  seed: string;
  variant?: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({ seed, variant = "botttsNeutral" }: Props) => {
  const avatar =
    variant === "botttsNeutral"
      ? createAvatar(botttsNeutral, { seed })
      : createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });

  return avatar.toDataUri();
};
