import { OVH_SERVICE_NAME } from "@/utils/env"
import ovh from "@/utils/ovh"
import strongPassword from "@/utils/strong-password"
import { sendOvhEnabledEmail } from "../send-email"

export async function enableOvhAccount(ovhEmail: string, userEmail: string) {
  const password = strongPassword()

  const result = await ovh(
    "POST",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${ovhEmail}/changePassword`,
    { password }
  )

  if (result.success) {
    sendOvhEnabledEmail(userEmail, password)
  }

  return result
}
