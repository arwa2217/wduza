import ChannelType from "./ChannelType";

declare type Channel = {
  id: string;
  createdAt: number;
  update_at: number;
  delete_at: number;
  team_id: string;
  type: ChannelType;
  display_name: string;
  name: string;
  header: string;
  purpose: string;
  last_post_at: number;
  total_msg_count: number;
  extra_update_at: number;
  creator_id: string;
  scheme_id: string;
  isCurrent?: boolean;
  teammate_id?: string;
  status?: string;
  fake?: boolean;
  group_constrained: boolean;
};

export default Channel;
