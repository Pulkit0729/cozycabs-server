import mongoose, { Document } from 'mongoose';
import { ILayout } from './layout';

enum ScreenType {
  SCREEN = 'Screen',
  MODAL = 'Modal',
  BOTTOMSHEET = 'BottomSheet',
}

export interface IScreen extends Document {
  screenId: string;
  name: string;
  type: ScreenType;
  title?: string;
  head?: ILayout;
  body?: ILayout;
  bottom?: ILayout;
}
const ScreenSchema = new mongoose.Schema<IScreen>(
  {
    screenId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      required: true,
      unique: true,
    },
    name: String,
    type: { type: String, enum: ScreenType },
    head: Object,
    body: Object,
    bottom: Object,
  },
  { timestamps: true }
);

const Screen = mongoose.model('Screens', ScreenSchema, 'screens');
export default Screen;
