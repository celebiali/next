import { Prism } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
const Pre = ({children,className}) => {
  console.log(className)

  return (
    <Prism language="javascript" style={atomDark}>
      {children}
    </Prism>
  )
}

export default Pre