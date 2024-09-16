import { IListTilesSection } from './listTile.section';

export interface IListViewSection {
  type: string;
  data: any[];
  isFetch: boolean;
  fetchWebhook: {};
  item: IListTilesSection;
}
