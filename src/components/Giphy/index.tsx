import React from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Portal, Segment, Input } from 'semantic-ui-react'
import { isMobile } from 'react-device-detect'
import { createDoc, useStore } from 'services'
import { useParams } from 'react-router-dom'
import { IAuthState, IChatState, ISettingState } from 'types'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'
import ClickAwayListener from 'react-click-away-listener'

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY)

interface Props {
  open: boolean
  onClose: () => void
  onScrollTop: () => void
}
interface State {
  term: string
}

const ReGiphy: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onScrollTop
}) => {
  if (!open) return null
  const dispatch = useDispatch()
  const { id } = useParams()
  const { uid, nickname, photoURL } = useStore<IAuthState>('auth')
  const { term } = useStore<IChatState>('chat')
  const { fcm_token } = useStore<ISettingState>('setting')
  const onKeyPress = (e: any) => {
    if (e.key !== 'Enter') return
  }
  const onGifClick = async (gif: any, e: any) => {
    e.preventDefault()
    await createDoc('chat', {
      message: '',
      roomId: id,
      userId: uid,
      username: nickname,
      avatar: photoURL,
      language: '',
      images: [],
      mentions: [],
      commands: [],
      giphy: gif.embed_url,
      fcm_token: fcm_token || ''
    })
    onClose()
    onScrollTop()
  }
  const fetchGifs = (offset: number) => gf.trending({ offset })
  return (
    <ClickAwayListener
      style={{
        position: 'absolute',
        zIndex: 1000,
        bottom: '75%',
        boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
        border: '1px solid rgba(34,36,38,.15)',
        borderRadius: 4
      }}
      onClickAway={onClose}
    >
      <Segment
        style={{
          left: '0%',
          position: 'absolute',
          bottom: '100%',
          zIndex: 1000,
          overflow: 'auto',
          height: 300
        }}
      >
        {/* <Input
          placeholder="검색..."
          value={term}
          name="term"
          onChange={(e) => dispatch(ChatActions.SET_TERM(e.target.value))}
          onKeyPress={onKeyPress}
        /> */}
        <Grid
          width={348}
          columns={3}
          fetchGifs={fetchGifs}
          onGifClick={onGifClick}
        />
      </Segment>
    </ClickAwayListener>
  )
}

export default ReGiphy
