import { Section } from './Sections';

export interface GPResponse {
  sections: [SectionContainer];
  screens: [Screen];
}

enum SectionComponentType {
  HERO,
  TITLE,
  PLUS_TITLE,
}

export interface SectionContainer {
  id: String;
  sectionComponentType: SectionComponentType;
  section: Section;
}
export interface Screen {
  id: String;
  screenProperties: ScreenProperties;
  layout: LayoutsPerFormFactor;
}

export interface LayoutsPerFormFactor {
  compact: ILayout;
  wide: ILayout;
}

interface ILayout {}

export interface SectionDetail {
  sectionId: String;
  topPadding: Number;
  bottomPadding: Number;
}

export interface SingleSectionPlacement {
  sectionDetail: SectionDetail!;
}

export interface MultipleSectionsPlacement {
  sectionDetails: [SectionDetail]!;
}

export interface SingleColumnLayout implements ILayout {
  nav: SingleSectionPlacement;
  main: MultipleSectionsPlacement;
  floatingFooter: SingleSectionPlacement;
}
