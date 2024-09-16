import { Document } from 'mongoose';
import { IListViewSection } from './sections/listView.section';
import { IListTilesSection } from './sections/listTile.section';

export interface ILayout extends Document {
  web: IListViewSection | IListTilesSection[];
  mobile: IListViewSection | IListTilesSection[];
}
