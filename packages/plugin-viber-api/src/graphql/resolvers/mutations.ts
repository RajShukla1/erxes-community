import { Accounts } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const viberMutations = {
  async viberAccountRemove(
    _root,
    { _id }: { _id: string },
    _context: IContext
  ) {
    await Accounts.removeAccount(_id);

    return 'deleted';
  }
};

export default viberMutations;
