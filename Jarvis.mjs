#!/usr/bin/env node

import path from 'path';
import fs from 'fs/promises';
import * as crypto from 'crypto';
import  {diffLines} from 'diff';
import chalk from 'chalk';
import {Command} from 'commander';

const program = new Command();

class Jarvis {
    
    constructor(repoPath = '.') {
        this.repoPath = path.join(repoPath, '.jarvis');
        this.objectsPath = path.join(this.repoPath, 'objects'); //.jarvis/objects
        this.headPath = path.join(this.repoPath,'HEAD'); //.jarvis/index
        this.indexPath = path.join(this.repoPath, 'index'); // .jarvis/index
        
    }

    static async create(repoPath = '.') {
        const jarvis = new Jarvis(repoPath);
        await jarvis.init();
        return jarvis;
    }

    async init() {
        await fs.mkdir(this.objectsPath, {recursive: true});

        try {
            await fs.writeFile(this.headPath, '', {flag: 'wx'}); // wx : open for writing. Fails if file exists.

            await fs.writeFile(this.indexPath, JSON.stringify([]), {flag: 'wx'});
        } catch(err) {
            console.log("Already initialized the .jarvis folder");
        }
    }

    hashObject(content) {
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex');
    }

    async add(fileToBeAdded) {
        const fileData = await fs.readFile(fileToBeAdded, {encoding: 'utf-8'}); // read the file

        const fileHash = this.hashObject(fileData); // hash the file

        console.log(fileHash);

        const newFileHashedObjectPath = path.join(this.objectsPath, fileHash); // .jarvis/objects/abc123

        await fs.writeFile(newFileHashedObjectPath, fileData);

        // TODO : One Step Missing : Add the file to the staging area.
        await this.updateStagingArea(fileToBeAdded, fileHash);

        console.log(`Added ${fileToBeAdded}`);
    }

    async updateStagingArea(filePath, fileHash) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'})); // read the index

        // add the file to the index
        const alreadyStaged = index.find(entry => entry.path === filePath && entry.hash === fileHash);
        if (!alreadyStaged) {
            index.push({ path: filePath, hash: fileHash });
        }

        await fs.writeFile(this.indexPath, JSON.stringify(index)); // write the updated index file
    }

    async commit(message) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'}));

        if (index.length === 0) {
            console.log("Nothing to commit.");
            return;
        }

        const parentCommit = await this.getCurrentHead();

        const commitData = {
            timestamp: new Date().toISOString(),
            message,
            files: index,
            parent: parentCommit
        }

        const commitHash = this.hashObject(JSON.stringify(commitData));

        const commitPath = path.join(this.objectsPath, commitHash);

        await fs.writeFile(commitPath, JSON.stringify(commitData));

        await fs.writeFile(
            this.headPath, commitHash);

        await fs.writeFile(
            this.indexPath, JSON.stringify([])
        )

        console.log("Commit Successfully Created");
    }

    async getCurrentHead() {
        try {
            return await fs.readFile(this.headPath, {encoding: 'utf-8'});
        } catch(err) {
            return null;
        }
    }

    async log() {
        let currentCommitHash = await this.getCurrentHead();

        while(currentCommitHash) {
            const commitData = JSON.parse(await fs.readFile(path.join(this.objectsPath, currentCommitHash), {encoding: 'utf-8'}));

            console.log("************************************");
            console.log(`Commit : ${currentCommitHash}`);
            console.log(`Date : ${commitData.timestamp}`);
            console.log(`${commitData.message}`);

            currentCommitHash = commitData.parent;
        }
    }

    async showCommitDiff(commitHash) {
        const commitData = JSON.parse(await this.getCommitData(commitHash));

        if (!commitData) {
            console.log("Commit not Found");
            return;
        }

        console.log("Changes in the last commit are : ");

        for(const file of commitData.files) {
            console.log(`File ${file.path}`);
            const fileContent = await this.getFileContent(file.hash);
            console.log(fileContent);

            if(commitData.parent) {
                // get the parent commit data : 

                const parentCommitData = JSON.parse(await this.getCommitData(commitData.parent));

                const getParentFileContent = await this.getParentFileContent(parentCommitData, file.path);

                if (getParentFileContent != undefined) {
                    console.log(`\nDiff : `);

                    const diff = diffLines(getParentFileContent, fileContent);

                    console.log(diff);

                    diff.forEach(part => {
                        if(part.added) {
                            process.stdout.write(`++ ${chalk.green(part.value)}`);
                        } else if (part.removed){
                            process.stdout.write(`-- ${chalk.red(part.value)}`);
                        }else {
                            process.stdout.write(`${chalk.grey(part.value)}`);
                        }
                    })
                    console.log(); //new line
                } else {
                    console.log("New File in this commit");
                }
            }
        }

    }

    async getCommitData(commitHash) {
        const commitPath = path.join(this.objectsPath, commitHash);

        try {
            return await fs.readFile(commitPath, {encoding: 'utf-8'});
        } catch(error) {
            console.log("Failed to read the commit data :",error);
            return null;
        }
    }

    async getFileContent(fileHash) {
        const objectPath = path.join(this.objectsPath, fileHash);
        return fs.readFile(objectPath, {encoding: 'utf-8'});
    }

    async getParentFileContent(parentCommitData, filePath) {
        const parentFile = parentCommitData.files.find(file => file.path === filePath);

        if (parentFile) {
            return await this.getFileContent(parentFile.hash);
        }
    }
}

program.command('init').action(async () => {
    const jarvis = await Jarvis.create();
})

program.command('add <file>').action(async (file) => {
    const jarvis = await Jarvis.create();
    await jarvis.add(file);
})

program.command('commit <message>').action(async (message) => {
    const jarvis = await Jarvis.create();
    await jarvis.commit(message);
})

program.command('log').action(async () => {
    const jarvis = await Jarvis.create();
    await jarvis.log();
})

program.command('show <commitHash>').action(async (commitHash) => {
    const jarvis = await Jarvis.create();
    await jarvis.showCommitDiff(commitHash);
})

program.parse(process.argv)