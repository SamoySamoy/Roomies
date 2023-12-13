import { useAppDispatch, useAppSelector } from '@/redux/store';
import { closeModal, openModal, OpenModalPlayLoad } from '@/redux/slices/modalSlice';

const useModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, modalType, data } = useAppSelector(state => state.modal);
  return {
    isOpen,
    modalType,
    openModal: (arg: OpenModalPlayLoad) => dispatch(openModal(arg)),
    closeModal: () => dispatch(closeModal()),
    data,
  };
};

export default useModal;
