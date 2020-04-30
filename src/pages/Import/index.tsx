import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import fileSize from 'filesize';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.map(file => data.append('file', file.file));

    try {
      const files = data.getAll('file');

      for (let i = 0; i < files.length; i += 1) {
        const importFile = new FormData();
        importFile.append('file', files[i]);
        // await api.post('/transactions/import', importFile);
        api.post('/transactions/import', importFile).then(response => {
          importFile.delete('file');
        });
      }

      setUploadedFiles([]);

      console.log(`Upload Files ${uploadedFiles}`);

      // for (const file of files) {
      // const importFile = new FormData();
      // importFile.append('file', file);
      // await api.post('/transactions/import', importFile);
      // }
      // setUploadedFiles([]);
    } catch (err) {
      console.log(err.response.error);
    }

    /* try {
      uploadedFiles.map(file => data.append('file', file.file));

      for (const file of data.getAll('file')) {
        const importFile = new FormData();
        importFile.append('file', file);
        // await api.post('/transactions/import', data);
        api.post('/transactions/import', data).then(file => {});
        importFile.delete('file');
      }
    } catch (err) {
      // console.log(err.response.error);
    } */
  }

  function submitFile(files: File[]): void {
    const newFiles: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: fileSize(file.size),
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
