import { DailyCommission } from '../types';
import {
  CommissionCardText,
  CommissionMarker,
  CommissionRealm,
  CommissionTitle,
  CompletedPanel,
  Rewards,
  StyledCommissionCard,
} from './CommissionCard.styles';
import { Checkbox } from './Checkbox';
import { useEffect, useState } from 'react';
import { ContainerWithTail } from './ContainerWithTail';
import { Reward } from './Reward';
import { Confirm } from './Confirm';
import { useConfirm } from '../hooks';
import * as images from '../images';

export type CommissionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  commission: DailyCommission;
  readOnly: boolean;
  onStatusChange?: (completed: boolean) => void;
  onDeleteRequested?: (id: number) => void;
};

export const CommissionCard: React.FC<CommissionCardProps> = ({
  commission,
  onStatusChange,
  onDeleteRequested,
  readOnly,
  ...props
}) => {
  const [isCompleted, setIsCompleted] = useState(commission.completed);
  const [confirmDelete, confirmDeleteProps] = useConfirm({
    onConfirm() {
      onDeleteRequested?.(commission.id);
    },
  });

  useEffect(() => {
    try {
      setIsCompleted(commission.completed);
    } catch (e) {
      console.error('Error setting commission completed status', e);
    }
  }, [commission]);

  useEffect(() => {
    if (isCompleted === commission.completed) return;
    onStatusChange?.(isCompleted);
  }, [isCompleted]);

  return (
    <ContainerWithTail onClick={confirmDelete}>
      <Confirm
        title="app.dailies.deleteCommission"
        message="app.dailies.confirmDeleteCommission"
        {...confirmDeleteProps}
      />
      <StyledCommissionCard
        {...props}
        onClick={(e) => {
          if (readOnly) {
            return;
          }
          if (props.onClick) props.onClick(e);
          if (isCompleted) {
            return;
          }
          setIsCompleted(true);
        }}
      >
        <CommissionMarker>
          <img src={images.CommissionOutline} height="40px" width="40px" />
        </CommissionMarker>
        <CommissionCardText>
          <CommissionTitle>{commission.description}</CommissionTitle>
          <CommissionRealm>
            {commission.realm ?? 'Realm of Missing Data'}
          </CommissionRealm>
        </CommissionCardText>
        <Rewards>
          {commission.rewards.map((reward) => (
            <Reward {...reward} key={reward.id} size="md" />
          ))}
        </Rewards>
        <CompletedPanel>
          <Checkbox checked={isCompleted} readOnly={readOnly} />
        </CompletedPanel>
      </StyledCommissionCard>
    </ContainerWithTail>
  );
};
