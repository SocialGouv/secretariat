import { OVH_SERVICE_NAME } from "@/utils/env"
import ovh from "@/utils/ovh"
import strongPassword from "@/utils/strong-password"

export function disableOvhAccount(email: string) {
  return ovh(
    "POST",
    `/email/exchange/${OVH_SERVICE_NAME}/service/${OVH_SERVICE_NAME}/account/${email}/changePassword`,
    { password: strongPassword() }
  )
}
