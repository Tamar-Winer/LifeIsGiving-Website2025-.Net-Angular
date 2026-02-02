import { Prize } from "./Prize";
import { User } from "./User";

export interface Donor extends User {
    prizesDonated:Prize[];
}