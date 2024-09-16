import { ActionTypes } from '../actions';

export interface IListTilesSection {
  type: string;
  icon: string;
  title: string;
  subtitle: string;
  action: ActionTypes;
}
