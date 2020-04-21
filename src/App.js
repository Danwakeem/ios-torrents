import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import WebTorrent from 'webtorrent';
import { useDropzone } from 'react-dropzone';
import { map, throttle } from 'lodash';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import {
  Container,
  Table,
  ProgressBar,
  Button,
  Jumbotron
} from 'react-bootstrap';

const client = new WebTorrent();

function App() {
  const [torrentFiles, setTorrentFiles] = useState({});
  const onDrop = useCallback(acceptedFiles => {
    client.add(acceptedFiles[0], (torrent) => {
      const id = uuid();
      setTorrentFiles({
        ...torrentFiles,
        [id]: torrent
      });
      const onDownload = () => {
        setTorrentFiles({
          ...torrentFiles,
          [id]: torrent
        });
      };
      torrent.on('download', throttle(onDownload, 300));
    });
  }, [torrentFiles])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Container>
      <h1>Download torrents</h1>
      <CustomJumbo {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop the files here or click to select files</p>
      </CustomJumbo>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Torrent Name</th>
            <th>Speed</th>
            <th>% Complete</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {map(torrentFiles, (torrent, key, index) => (
            <tr key={key}>
              <td>1</td>
              <td>{torrent.name}</td>
              <td>
                <FontAwesomeIcon icon={faArrowDown} />{Math.floor(torrent.downloadSpeed)}/{torrent.uploadSpeed}<FontAwesomeIcon icon={faArrowUp} />
              </td>
              <td><ProgressBar now={Math.floor(torrent.progress * 100)} label={`${Math.floor(torrent.progress * 100)}%`} /></td>
              <td>
                <Button variant="primary" disabled={torrent.progress !== 100}>Download</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

const CustomJumbo = styled(Jumbotron)`
  padding: 2rem !important;

  p {
    margin-bottom: 0;
  }
`;

export default App;
