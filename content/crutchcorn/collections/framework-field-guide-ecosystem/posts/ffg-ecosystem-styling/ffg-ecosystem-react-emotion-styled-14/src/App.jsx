import styled from '@emotion/styled';

const headerColor = '#2A3751';

const H1 = styled.h1`
  color: ${headerColor};
  font-size: 2rem;
  text-decoration: underline;
`;

export function App() {
	return <H1>I am a heading</H1>;
}
