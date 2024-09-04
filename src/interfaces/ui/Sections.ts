import { IAction } from './Action';
import { TextStyle } from './Styles';

export type Section = HeroSection | TitleSection;

export interface HeroSection {
  images: [String];
}

export interface TitleSection {
  title: String;
  titleStyle: TextStyle;
  subtitle?: String;
  subtitleStyle?: TextStyle;
  onSubtitleClickAction: IAction;
}
