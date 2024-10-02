// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsInt, Min } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @Column({unique: true})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @Column()
    @IsInt({message: 'Age must be an integer'})
    @Min(0, {message: 'Age connot be negative'})
    age: number
}