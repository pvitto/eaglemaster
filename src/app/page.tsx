// Redirige inmediatamente al prototipo de InfoAlert
import { redirect } from "next/navigation";

export default function Root() {
  redirect("/infoalert");
  return null;
}
