import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 0.9;
  align-items: center;
  width: 100%;
`;

export const Text = styled.Text`
  color: white;
`;
export const DownPreview = styled.View<{isShow: boolean}>`
  width: 100%;
  padding: 30px 0;
  justify-content: space;
  flex: 0.3;
  display: ${props => (props.isShow ? 'block' : 'none')};
`;
