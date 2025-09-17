import './local/local-strategy';
import './jwt/jwt-strategy';

import { ContoCorrente as iUser } from '../../api/Conto-Corrente/conto-corrente-entity'

declare global {
    namespace Express {
        interface User extends iUser { }
    }
}